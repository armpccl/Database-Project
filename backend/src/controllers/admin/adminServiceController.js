import Question from '../../models/Question.js';
// import Claim from '../../models/Claim.js'; // If you implement Claim management

// === Question Management ===
export const getAllQuestions = async (req, res, next) => {
    try {
        // Add filtering by status (e.g., open, answered) if Question table has a status field
        const questions = await Question.findAll(); // Question model needs findAll
        res.json(questions);
    } catch (error) {
        next(error);
    }
};

export const getQuestionDetails = async (req, res, next) => {
    try {
        // A question is identified by (userID, time). You'll need both.
        // Or, if Question table has its own simple PK (e.g., questionID AUTO_INCREMENT), use that.
        // Assuming for this example Question model's findById can take a composite key object or a single PK.
        // Let's assume Question table has a `questionID` as PK for simplicity here.
        // If using (userID, time), route might be /questions/:userID/:timestamp or pass in body/query.
        const { id: questionID } = req.params; // Assuming questionID is the PK
        const question = await Question.findById(questionID); // Question model needs findById
        if (question) {
            res.json(question);
        } else {
            res.status(404);
            throw new Error('Question not found.');
        }
    } catch (error) {
        next(error);
    }
};

export const updateQuestion = async (req, res, next) => {
    // This would typically involve adding an answer or changing its status.
    // Your Question table schema doesn't explicitly have an 'answer' or 'status' field.
    // You might need to add them: e.g., `answer TEXT`, `status VARCHAR(50) DEFAULT 'Open'`
    try {
        const { id: questionID } = req.params;
        const { answer, status } = req.body; // Assuming these fields exist or are added to Question table

        // const question = await Question.findById(questionID);
        // if (!question) {
        //     res.status(404); throw new Error('Question not found.');
        // }

        const updateData = {};
        // if (answer !== undefined) updateData.answer = answer;
        // if (status !== undefined) updateData.status = status;
        // Add any other updatable fields for a question by an admin.

        // For now, let's assume only `qna_type` and `description` can be edited, which is unlikely for admin.
        // More likely, admin adds a response or changes status.
        // Let's assume Question table has 'admin_response' TEXT and 'status' VARCHAR(20)
        if (req.body.admin_response) updateData.admin_response = req.body.admin_response;
        if (req.body.status) updateData.status = req.body.status;


        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided for question." });
        }
        updateData.last_admin_update = new Date(); // Add a field like this to Question table


        const result = await Question.update(questionID, updateData); // Question model needs generic update
        if (result.affectedRows > 0) {
            const updatedQuestion = await Question.findById(questionID);
            res.json(updatedQuestion);
        } else {
            res.status(404); // Or 304
            throw new Error('Question not found or no changes made.');
        }
    } catch (error) {
        next(error);
    }
};

// Admin can also delete reviews (this is also in adminReviewController, decide where it fits best or have both)
// Admin can read reviews (covered by adminReviewController.getAllReviews)