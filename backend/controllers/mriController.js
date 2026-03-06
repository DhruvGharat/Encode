const supabase = require('../config/supabase');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/mri/upload
// @desc    Upload MRI scan file(s) and trigger analysis (mocked AI)
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.uploadMRI = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No MRI file selected. Please upload at least one scan.',
      });
    }

    const userId = req.user.id;
    const uploadedScans = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = ['.dcm', '.nii', '.nrrd', '.png', '.jpg', '.jpeg'];

      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({
          success: false,
          message: `File format not supported: ${ext}. Allowed: DICOM, NIfTI, NRRD, PNG.`,
        });
      }

      // --- Upload to Supabase Storage ---
      const storagePath = `${userId}/${Date.now()}-${file.originalname}`;

      const { error: storageError } = await supabase.storage
        .from('mri-scans')
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (storageError) {
        console.error('[MRI Storage Error]', storageError);
        continue; // Skip this file but continue with others
      }

      const { data: urlData } = supabase.storage
        .from('mri-scans')
        .getPublicUrl(storagePath);

      const file_url = urlData?.publicUrl || null;

      // --- Mock AI Analysis Results ---
      // In production, send to a neuroimaging ML pipeline (e.g., FreeSurfer, 3D U-Net)
      const hippocampal_vol = parseFloat((3000 + Math.random() * 1200).toFixed(1)); // mm³
      const atrophy_pct     = parseFloat((Math.random() * 20).toFixed(1));           // %
      let risk_level = 'Low';
      if (atrophy_pct > 10) risk_level = 'Moderate';
      if (atrophy_pct > 15) risk_level = 'High';

      // --- Determine format ---
      const formatMap = {
        '.dcm': 'DICOM',
        '.nii': 'NIfTI',
        '.nrrd': 'NRRD',
        '.png': 'PNG',
        '.jpg': 'JPEG',
        '.jpeg': 'JPEG',
      };

      // --- Save MRI record to DB ---
      const { data: scanRecord, error: dbError } = await supabase
        .from('mri_scans')
        .insert({
          user_id: userId,
          file_name: file.originalname,
          file_url,
          file_size_bytes: file.size,
          file_format: formatMap[ext] || 'Unknown',
          status: 'verified',
          hippocampal_vol,
          atrophy_pct,
          risk_level,
          analysis_notes: `Hippocampal volume: ${hippocampal_vol} mm³. Atrophy: ${atrophy_pct}%.`,
          analyzed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        console.error('[MRI DB Error]', dbError);
        continue;
      }

      // Auto-generate report
      await supabase.from('reports').insert({
        user_id: userId,
        report_id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        title: 'Hippocampal Volumetric Report',
        report_type: 'MRI Insight',
        mri_scan_id: scanRecord.id,
        risk_level,
        summary: `MRI scan analyzed. Hippocampal volume: ${hippocampal_vol} mm³. Atrophy: ${atrophy_pct}%.`,
      });

      uploadedScans.push({
        file_name: file.originalname,
        file_size_bytes: file.size,
        hippocampal_vol,
        atrophy_pct,
        risk_level,
        status: 'verified',
        scan_id: scanRecord.id,
      });
    }

    if (uploadedScans.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'All file uploads failed. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadedScans.length} scan(s) uploaded and analyzed successfully.`,
      data: uploadedScans,
    });
  } catch (err) {
    console.error('[MRI Upload Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/mri/history
// @desc    Get all MRI scans submitted by the logged-in user
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.getMRIHistory = async (req, res) => {
  try {
    const { data: scans, error } = await supabase
      .from('mri_scans')
      .select('id, file_name, file_format, file_size_bytes, status, hippocampal_vol, atrophy_pct, risk_level, submitted_at, analyzed_at')
      .eq('user_id', req.user.id)
      .order('submitted_at', { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch MRI history.' });
    }

    res.status(200).json({ success: true, data: scans });
  } catch (err) {
    console.error('[MRI History Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
