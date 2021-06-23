import React, { Fragment, useState } from 'react'
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';

const FileUpload = () => {

    const [file ,setFile] = useState('');
    const [fileName, setFileName]= useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPer, setUploadPer]= useState(0);

    const handleChange= (e)=>{
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }
    const  handleSubmit= async  (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
                const res =await axios.post('/upload', formData, {
                    headers :{
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: progressEvent => {
                        // eslint-disable-next-line
                        setUploadPer(parseInt(Math.round((progressEvent.loaded*100) / progressEvent.total)));
                        //clear percentage
                        setTimeout(() => {
                            setUploadPer(0);
                        }, 10000);
                    }

                });
                const  { fileName, filePath} = res.data; 
                setUploadedFile ({ fileName, filePath}); 
                setMessage('File uploaded');
                
                    
            }
            catch(err){
                if(err.response.status === 500){
                    setMessage('Problem with server');
                }
                else {
                    setMessage(err.response.data.msg);
                }
        }
    }

    return (
       <Fragment>
            {message ? <Message msg= {message}/> : null}
            <form onSubmit= {handleSubmit}>
                <div className="custom-file">
                    <input 
                        type="file" 
                        className="custom-file-input" 
                        id="customFile"
                        onChange= {handleChange} 
                    />
                    <label 
                        className="custom-file-label" 
                        htmlFor="customFile">
                        {fileName}
                    </label>
                </div>

                <Progress percentage= {uploadPer} />
                <input type= "submit" value= "Upload" className= "btn btn-primary btn-block mt-4" />
              
            </form>
            {uploadedFile ?  <div className="row mt-5">
                <div className= "col-md-6 m-auto">
                    <h3  className="text-center">{ uploadedFile.fileName }</h3>
                    <img src= {uploadedFile.filePath} style={{width: '100%'}} alt= ""/>
                </div>
            </div> : null}
       </Fragment>
    )
}

export default FileUpload
