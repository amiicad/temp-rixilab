// routes/internQuizRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust path if needed
const Quiz = require("../models/Quiz"); // Adjust path if needed

// GET /intern/quiz/:quizId - render quiz page
router.get("/quiz/:quizId", async (req, res) => {
  try {
     const userAgent = req.headers['user-agent'];

  if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
    return req.flash("error", "Quiz can only be taken on a desktop / laptop."), res.redirect("/intern");
  }
    const intern_id = req.session.user;
    const { quizId } = req.params;

    const intern = await User.findById(intern_id);
    if (!intern) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/login");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      req.flash("error", "Quiz not found");
      return res.redirect("/intern");
    }

    const assignment = intern.quizAssignments.find(
      (a) => a.quizId.toString() === quizId.toString()
    );

    if (!assignment) {
      req.flash("error", "This quiz is not assigned to you");
      return res.redirect("/intern");
    }

    if (assignment.attemptCount >= 2) {
      req.flash("error", "You have reached the maximum attempts for this quiz");
      return res.redirect("/intern");
    }

     // ===== Quiz Duration: 1.5 min per question =====
    const numQuestions = quiz.questions.length;
    const quizDuration = numQuestions * 1.5; // minutes

    res.render("quiz", {
      quiz,
      intern,
      assignment,
      messages: req.flash(),
      quizDuration,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to load quiz");
    res.redirect("/intern");
  }
});

router.post("/quiz/:quizId/submit", async (req, res) => {
  try {
    const intern_id = req.session.user; // get intern from session
    const { quizId } = req.params;

    // 1) Find intern
    const intern = await User.findById(intern_id);
    if (!intern) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/login");
    }

    // 2) Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      req.flash("error", "Quiz not found");
      return res.redirect("/intern/my-quizzes");
    }

    // 3) Check assignment
    const assignmentIndex = intern.quizAssignments.findIndex(
      (a) => a.quizId.toString() === quizId.toString()
    );

    if (assignmentIndex === -1) {
      req.flash("error", "This quiz is not assigned to you");
      return res.redirect("/intern/my-quizzes");
    }

    const assignment = intern.quizAssignments[assignmentIndex];

    // 4) Check attempt limit
    if (assignment.attemptCount >= 2) {
      req.flash("error", "You have reached the maximum attempts for this quiz");
      return res.redirect("/intern");
    }

    // 5) Calculate score
    const answers = req.body.answers || {};
    // console.log("DEBUG: answers received from form:", answers); // <-- debug log

    let score = 0;

    quiz.questions.forEach((q, index) => {
      const key = index.toString();
      const selected = answers[key];
      // console.log(
      //   `DEBUG: Question ${index + 1} correctAnswer=${
      //     q.correctAnswer
      //   }, selected=${selected}`
      // );

      if (selected != null && Number(selected) === Number(q.correctAnswer)) {
        score += 1;
        // console.log(`DEBUG: Question ${index + 1} correct! Score=${score}`);
      }
    });

    // console.log(`DEBUG: Final Score = ${score} / ${quiz.questions.length}`);

    const totalQuestions = quiz.questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    if (percentage >= 60) {
      intern.isPassed = true;
    }

    // 6) Update User assignment
    assignment.score = score;
    assignment.attemptCount += 1;
    intern.quizAssignments[assignmentIndex] = assignment;

    if (!intern.quiz_score || score > intern.quiz_score) {
      intern.quiz_score = score;
    }

    await intern.save();

    req.flash(
      "success",
      `Quiz submitted successfully!`
    );
    res.redirect("/intern");
  } catch (error) {
    // console.error(error);
    req.flash("error", "Failed to submit quiz");
    res.redirect("/intern");
  }
});

module.exports = router;
