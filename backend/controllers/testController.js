const supabase = require('../config/supabase');

// ─── Helper: Determine risk level from score ──────────────────────────────────
const getRiskLevel = (score, maxScore, testType) => {
  const pct = (score / maxScore) * 100;
  if (testType === 'MMSE') {
    if (score >= 24) return 'Low';
    if (score >= 18) return 'Moderate';
    return 'High';
  }
  if (testType === 'MoCA') {
    if (score >= 26) return 'Low';
    if (score >= 18) return 'Moderate';
    return 'High';
  }
  return pct >= 70 ? 'Low' : pct >= 40 ? 'Moderate' : 'High';
};

// ─── Helper: Break answers into per-section scores ───────────────────────────
const computeSectionScores = (answers, questions) => {
  const sectionMap = {};
  questions.forEach((q) => {
    if (!sectionMap[q.section]) {
      sectionMap[q.section] = { correct: 0, total: 0 };
    }
    sectionMap[q.section].total += q.score;
    if (answers[q.id] === q.correctAnswer) {
      sectionMap[q.section].correct += q.score;
    }
  });
  return sectionMap;
};

// ─── Helper: Build a report_id string ────────────────────────────────────────
const genReportId = () => {
  return `REP-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/tests/mmse
// @desc    Submit MMSE test answers, calculate score, save to DB
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.submitMMSE = async (req, res) => {
  try {
    const { answers, duration_secs, questions } = req.body;
    // `questions` sent from the frontend contains: id, section, correctAnswer, score

    if (!answers || !questions) {
      return res.status(400).json({
        success: false,
        message: 'Answers and questions are required.',
      });
    }

    const MAX_SCORE = 30;

    // Calculate total score
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score += q.score;
    });

    const risk_level = getRiskLevel(score, MAX_SCORE, 'MMSE');
    const section_scores = computeSectionScores(answers, questions);

    // Save result to Supabase
    const { data: result, error } = await supabase
      .from('test_results')
      .insert({
        user_id: req.user.id,
        test_type: 'MMSE',
        score,
        max_score: MAX_SCORE,
        risk_level,
        answers,
        section_scores,
        duration_secs: duration_secs || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[MMSE Submit DB Error]', error);
      return res.status(500).json({ success: false, message: 'Failed to save test result.' });
    }

    // Auto-generate a report entry
    await supabase.from('reports').insert({
      user_id: req.user.id,
      report_id: genReportId(),
      title: 'MMSE Assessment Summary',
      report_type: 'Clinical Test',
      test_result_id: result.id,
      risk_level,
      summary: `MMSE Score: ${score}/${MAX_SCORE}. Risk Level: ${risk_level}.`,
    });

    res.status(201).json({
      success: true,
      data: {
        score,
        max_score: MAX_SCORE,
        risk_level,
        section_scores,
        result_id: result.id,
      },
    });
  } catch (err) {
    console.error('[MMSE Submit Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/tests/moca
// @desc    Submit MoCA test answers, calculate score, save to DB
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.submitMoCA = async (req, res) => {
  try {
    const { answers, duration_secs, questions } = req.body;

    if (!answers || !questions) {
      return res.status(400).json({
        success: false,
        message: 'Answers and questions are required.',
      });
    }

    const MAX_SCORE = 30;

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score += q.score;
    });

    const risk_level = getRiskLevel(score, MAX_SCORE, 'MoCA');
    const section_scores = computeSectionScores(answers, questions);

    const { data: result, error } = await supabase
      .from('test_results')
      .insert({
        user_id: req.user.id,
        test_type: 'MoCA',
        score,
        max_score: MAX_SCORE,
        risk_level,
        answers,
        section_scores,
        duration_secs: duration_secs || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[MoCA Submit DB Error]', error);
      return res.status(500).json({ success: false, message: 'Failed to save test result.' });
    }

    await supabase.from('reports').insert({
      user_id: req.user.id,
      report_id: genReportId(),
      title: 'MoCA Assessment Summary',
      report_type: 'Clinical Test',
      test_result_id: result.id,
      risk_level,
      summary: `MoCA Score: ${score}/${MAX_SCORE}. Risk Level: ${risk_level}.`,
    });

    res.status(201).json({
      success: true,
      data: {
        score,
        max_score: MAX_SCORE,
        risk_level,
        section_scores,
        result_id: result.id,
      },
    });
  } catch (err) {
    console.error('[MoCA Submit Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/tests/history
// @desc    Get all test results for the logged-in user
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getTestHistory = async (req, res) => {
  try {
    const { test_type, limit = 10, offset = 0 } = req.query;

    let query = supabase
      .from('test_results')
      .select('id, test_type, score, max_score, risk_level, section_scores, duration_secs, completed_at')
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (test_type) query = query.eq('test_type', test_type.toUpperCase());

    const { data: results, error, count } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch test history.' });
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    console.error('[Get Test History Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/tests/latest-scores
// @desc    Get the latest MMSE and MoCA scores for the dashboard
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getLatestScores = async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('test_results')
      .select('test_type, score, max_score, risk_level, completed_at')
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch scores.' });
    }

    // Pick the most recent of each type
    const latestMMSE = results.find((r) => r.test_type === 'MMSE') || null;
    const latestMoCA = results.find((r) => r.test_type === 'MoCA') || null;

    res.status(200).json({
      success: true,
      data: { MMSE: latestMMSE, MoCA: latestMoCA },
    });
  } catch (err) {
    console.error('[GetLatestScores Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
