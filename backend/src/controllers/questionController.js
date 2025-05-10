import Question from '../models/Question.js'; // Assuming Question model is created

// Helper for unique question ID if primary key is not (userID, time) or you need one
// For Question table, PK is (userID, time), so 'time' uniqueness per user is key.

export const submitQuestion = async (req, res, next) => {
  try {
    const userID = req.user.userID;
    const { qna_type, description } = req.body;

    if (!description) {
      res.status(400);
      throw new Error('Question description cannot be empty.');
    }
    // The 'time' field defaults to CURRENT_TIMESTAMP in the DB.
    // Question.create should handle this.
    const questionData = {
        userID,
        qna_type: qna_type || 'General Inquiry', // Default type if not provided
        description
    };

    const newQuestion = await Question.create(questionData);
    res.status(201).json({ message: 'Question submitted successfully.', question: newQuestion });
  } catch (error)
  {
    // Handle potential primary key violation if time isn't unique enough for that user (rare)
    if (error.code === 'ER_DUP_ENTRY') {
        res.status(409); // Conflict
        throw new Error('A question was submitted too recently. Please wait a moment and try again.');
    }
    next(error);
  }
};

export const getUserQuestions = async (req, res, next) => {
  try {
    const userID = req.user.userID;
    const questions = await Question.findByUserId(userID);
    res.json(questions);
  } catch (error) {
    next(error);
  }
};