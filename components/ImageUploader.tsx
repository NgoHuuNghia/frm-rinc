import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Uploads images to Firebase Storage
export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);//? fire being actively upload
    const [progress, setProgress] = useState(0);//? percentage of the file uploads till finish
    const [downloadURL, setDownloadURL] = useState(null); //? the image url duh

    // Creates a Firebase Upload Task
    const uploadFile = async (e) => {
        // Get the file

        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1]; //? grab the file extension like png from the file type

        // Makes reference to the storage bucket location
        const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);//? with a unique date so it can't be overwritten
        setUploading(true);

        // Starts the upload
        const task = uploadBytesResumable(fileRef, file)

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(pct);
        })

        //* Get downloadURL AFTER task resolves (Note: this is not a native Promise)
        task
            .then((d) => getDownloadURL(fileRef))//? then allow us to get the download url only when it 100% finish to avoid errors
            .then((url) => {
                setDownloadURL(url);
                setUploading(false);
            });
    };

    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}

            {!uploading && (
                <>
                    {/*//$ as you can see we are using a form label with an input type of file inside, because the default html file
                       //$ input is infamously hard to style but if you put it inside a label, then it will automatically focus to
                       //$ input when clicked */}
                    <label className="btn">
                        📸 Upload Img
                        <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg"/>
                    </label>
                </>
            )}

            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}{/*//? code snippet to paste to the markdown */}
        </div>
    );
}