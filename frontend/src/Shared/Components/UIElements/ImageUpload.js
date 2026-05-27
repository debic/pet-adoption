import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
import Button from "../Button";

export default function ImageUpload(props) {
  const filePickerRef = useRef();
  const [file, setFile] = useState()
  const [prevUrl, setPrevUrl] = useState()
  const [isValid, setIsValid] =useState(false)

 useEffect(() => {
  if (!file) {
    props.onInput(props.id, null, false);
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = () => {
    setPrevUrl(fileReader.result);
    props.onInput(props.id, file, true);
  };
  fileReader.readAsDataURL(file);
}, [file]);


const pickedHandler = event =>{
  let pickedFile;
  let fileIsValid = isValid
  if(event.target.files && event.target.files.length === 1){
     pickedFile = event.target.files[0]
    setFile(pickedFile)
    setIsValid(true)
    fileIsValid = true
  }else{
    setIsValid(false)
    fileIsValid = false
  }
  props.onInput(props.id, pickedFile, fileIsValid)
}

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__prev">
          {prevUrl && <img src={prevUrl} alt="preview" />}
          {!prevUrl && <p className="image-upload__prev-text">Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          {" "}
          Pick Image
        </Button>
      </div>
            {!isValid && <p>{props.errorText}</p>}

    </div>
  );
}
