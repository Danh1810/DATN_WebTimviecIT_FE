// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// function FilePreview() {
//   const { fileName } = useParams(); // Get the file name from the URL
//   const [fileUrl, setFileUrl] = useState("");

//   useEffect(() => {
//     // Assuming the file is served at '/uploads/' in your backend
//     setFileUrl(`/uploads/${fileName}`);
//   }, [fileName]);

//   return (
//     <div className="file-preview-container">
//       <h2 className="text-2xl font-semibold mb-4">File Preview</h2>
//       {fileUrl && (
//         <iframe
//           src={fileUrl}
//           title="File Preview"
//           className="w-full h-96 border rounded"
//         />
//       )}
//     </div>
//   );
// }

// export default FilePreview;
