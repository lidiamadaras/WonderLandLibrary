import openai from '../config/openai.mjs';
import { addRecommendation, linkRecommendationWithBook } from '../repositories/bookRepository.mjs';
import { fetchBooksForUser, saveBook } from './bookController.mjs';


export const parseAIRecommendations = (aiResponse) => {
  // Split the response to rows, and delete the whitespace characters
  const lines = aiResponse.split('\n').filter(line => line.trim() !== '');

  return lines.map(line => {
    // Remove the numbering
    const cleanedLine = line.replace(/^\d+\.\s*/, '').trim();

    // Parsing the output text
    const match = cleanedLine.match(/^(?<title>.+?), \{(?<authorFirstName>[^,]+), (?<authorLastName>[^,]+)\}, (?<publisherName>[^,]+), (?<reason>.+)$/);

    if (!match || !match.groups) {
      throw new Error(`Failed to parse line: "${line}"`);
    }

    return {
      title: match.groups.title.trim(),
      authorFirstName: match.groups.authorFirstName.trim(),
      authorLastName: match.groups.authorLastName.trim(),
      publisherName: match.groups.publisherName.trim(),
      reason: match.groups.reason.trim(),
    };
  });
};

  export const recommendBooks = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const books = await fetchBooksForUser(userId);
  
      if (books.length === 0) {
        return res.status(200).json({ message: 'No books found on the bookshelf to generate recommendations.' });
      }
  
      const bookTitles = books.map((book) => book.booktitle).join(', ');
      const prompt = `I have the following books on my bookshelf: ${bookTitles}. Can you recommend three similar books I might like? It is very important for me, that your response contains only the following structures: name of the book, {author first name, author last name}, publisher name, reason I might like it`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      });
      
      const recommendations = response.choices[0].message.content;
      const parsedRecommendations = parseAIRecommendations(recommendations);
  
      const recommendationId = await addRecommendation(userId);
  
      for (const book of parsedRecommendations) {
        const { title, authorFirstName, authorLastName, publisherName, reason } = book;
  
        const newBook = await saveBook({
          title,
          authorFirstName,
          authorLastName,
          publisherName,
          genres: [],
        });
  
        await linkRecommendationWithBook(recommendationId, newBook.bookid, reason);
      }
  
      res.status(201).json({ message: 'Recommendations saved successfully.' });
    } catch (error) {
      console.error('Error recommending books:', error.message);
      next(error);
    }
  };