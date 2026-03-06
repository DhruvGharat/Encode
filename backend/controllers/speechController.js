const supabase = require('../config/supabase');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/speech/upload
// @desc    Upload speech audio recording and trigger AI analysis (mocked)
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.uploadSpeech = async (req, res) => {
  try {
    const { duration_secs } = req.body;

    // req.file is populated by multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file found. Please record and submit your speech.',
      });
    }

    // --- Upload to Supabase Storage ---
    const userId = req.user.id;
    const fileName = `${userId}/${Date.now()}-${req.file.originalname}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('speech-recordings')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (storageError) {
      console.error('[Speech Storage Error]', storageError);
      return res.status(500).json({ success: false, message: 'Failed to upload audio file.' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('speech-recordings')
      .getPublicUrl(fileName);
    const audio_url = urlData?.publicUrl || null;

    // --- Mock AI Analysis ---
    // In production, you'd call an ML service (e.g., Google Speech API, Azure Cognitive)
    const stability_pct = parseFloat((85 + Math.random() * 14).toFixed(1));  // 85-99%
    const jitter_f0     = parseFloat((0.1 + Math.random() * 0.5).toFixed(2)); // 0.1-0.6%
    const neural_latency = parseFloat((10 + Math.random() * 10).toFixed(1));  // 10-20ms

    let risk_level = 'Low';
    if (stability_pct < 75 || jitter_f0 > 0.4) risk_level = 'Moderate';
    if (stability_pct < 60 || jitter_f0 > 0.6) risk_level = 'High';

    // --- Save analysis to DB ---
    const { data: speechResult, error: dbError } = await supabase
      .from('speech_analyses')
      .insert({
        user_id: userId,
        audio_url,
        duration_secs: duration_secs ? parseFloat(duration_secs) : null,
        stability_pct,
        jitter_f0,
        neural_latency,
        risk_level,
        analysis_notes: 'AI vocal biomarker analysis completed successfully.',
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Speech DB Error]', dbError);
      return res.status(500).json({ success: false, message: 'Failed to save analysis results.' });
    }

    // Auto-generate report
    await supabase.from('reports').insert({
      user_id: userId,
      report_id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'Vocal Biomarker Signature',
      report_type: 'Speech Analysis',
      speech_id: speechResult.id,
      risk_level,
      summary: `Speech stability: ${stability_pct}%. Jitter: ${jitter_f0}%. Risk: ${risk_level}.`,
    });

    res.status(201).json({
      success: true,
      data: {
        stability_pct,
        jitter_f0,
        neural_latency,
        risk_level,
        analysis_notes: 'AI vocal biomarker analysis completed successfully.',
        speech_id: speechResult.id,
      },
    });
  } catch (err) {
    console.error('[Speech Upload Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/speech/history
// @desc    Get past speech analyses for the logged-in user
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getSpeechHistory = async (req, res) => {
  try {
    const { data: analyses, error } = await supabase
      .from('speech_analyses')
      .select('id, stability_pct, jitter_f0, neural_latency, risk_level, duration_secs, submitted_at')
      .eq('user_id', req.user.id)
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch speech history.' });
    }

    res.status(200).json({ success: true, data: analyses });
  } catch (err) {
    console.error('[Speech History Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
