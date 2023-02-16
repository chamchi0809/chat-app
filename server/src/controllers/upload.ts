export default {
    uploadAttachment: async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                downloadUrl: `http://localhost:5000/${req.filePath}/${req.file.filename}`
            });
        } catch (error) {
            return res.status(500).json({success: false, error: error});
        }
    },
}