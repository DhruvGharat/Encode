const supabase = require('../config/supabase');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/reports
// @desc    Get all clinical reports for the logged-in user
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getReports = async (req, res) => {
  try {
    const { type, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('reports')
      .select('id, report_id, title, report_type, risk_level, summary, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (type) query = query.eq('report_type', type);

    const { data: reports, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
    }

    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    console.error('[Get Reports Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/reports/summary
// @desc    Get a full clinical summary for the dashboard's Reports page
//          Returns: latest scores, risk profile, all reports list
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getClinicalSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all test results
    const { data: testResults } = await supabase
      .from('test_results')
      .select('test_type, score, max_score, risk_level, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    // Fetch latest speech analysis
    const { data: speechResults } = await supabase
      .from('speech_analyses')
      .select('stability_pct, jitter_f0, neural_latency, risk_level, submitted_at')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1);

    // Fetch latest MRI scan
    const { data: mriResults } = await supabase
      .from('mri_scans')
      .select('hippocampal_vol, atrophy_pct, risk_level, file_name, analyzed_at')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1);

    // Fetch all reports
    const { data: reports } = await supabase
      .from('reports')
      .select('id, report_id, title, report_type, risk_level, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Compute overall risk from latest tests
    const latestMMSE = testResults?.find((r) => r.test_type === 'MMSE');
    const latestMoCA = testResults?.find((r) => r.test_type === 'MoCA');
    const latestSpeech = speechResults?.[0] || null;
    const latestMRI = mriResults?.[0] || null;

    // Aggregate risk level (worst of all)
    const riskPriority = { High: 3, Moderate: 2, Low: 1 };
    const allRisks = [
      latestMMSE?.risk_level,
      latestMoCA?.risk_level,
      latestSpeech?.risk_level,
      latestMRI?.risk_level,
    ].filter(Boolean);

    const overallRisk = allRisks.length > 0
      ? allRisks.reduce((max, r) => riskPriority[r] > riskPriority[max] ? r : max, 'Low')
      : 'Low';

    res.status(200).json({
      success: true,
      data: {
        overall_risk: overallRisk,
        scores: {
          MMSE: latestMMSE
            ? { score: latestMMSE.score, max_score: latestMMSE.max_score, risk_level: latestMMSE.risk_level, date: latestMMSE.completed_at }
            : null,
          MoCA: latestMoCA
            ? { score: latestMoCA.score, max_score: latestMoCA.max_score, risk_level: latestMoCA.risk_level, date: latestMoCA.completed_at }
            : null,
          speech: latestSpeech
            ? { stability_pct: latestSpeech.stability_pct, neural_latency: latestSpeech.neural_latency, risk_level: latestSpeech.risk_level, date: latestSpeech.submitted_at }
            : null,
          mri: latestMRI
            ? { hippocampal_vol: latestMRI.hippocampal_vol, atrophy_pct: latestMRI.atrophy_pct, risk_level: latestMRI.risk_level, date: latestMRI.analyzed_at }
            : null,
        },
        reports: reports || [],
        test_history: testResults || [],
      },
    });
  } catch (err) {
    console.error('[Clinical Summary Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/reports/:reportId
// @desc    Get a single report by its UUID
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getReportById = async (req, res) => {
  try {
    const { data: report, error } = await supabase
      .from('reports')
      .select(`
        id, report_id, title, report_type, risk_level, summary, created_at,
        test_result_id, mri_scan_id, speech_id
      `)
      .eq('id', req.params.reportId)
      .eq('user_id', req.user.id) // Ensure ownership
      .single();

    if (error || !report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error('[Get Report Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
