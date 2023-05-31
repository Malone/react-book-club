import React from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage} from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setmovieList] = useState([]);

  const [movieTitle, setMovieTitle] = useState("");
  const [movieReleaseDate, setMovieReleaseDate] = useState(0);
  const [receiveOscar, setReceiveOscar] = useState(true);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const movies = await getDocs(moviesCollectionRef);
      const filteredData = movies.docs.map(doc => ({          
          ...doc.data(),
          id: doc.id          
      }));        
      setmovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  }

  const editMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, {title: updatedTitle});
      getMovieList(); 
    } catch (error) {
      console.error(error);
    }
  }
  
  const uploadFile = async () => {    
    if(!fileUpload) return;
    console.log("Uploading the file...." + fileUpload.name);
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      
      const response = await uploadBytes(filesFolderRef, fileUpload);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    // This code will run after the component has rendered    
    console.log("useEffect");
    getMovieList();    
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: movieTitle,
        releaseDate: movieReleaseDate,
        receiveOscar: receiveOscar,
        userId: auth && auth.currentUser && auth.currentUser.uid
      });
      getMovieList(); 
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <Auth />      
      <div>
        <input placeholder="Movie title..." onChange={e => setMovieTitle(e.target.value)}/>
        <input placeholder="Release date..." type="number" 
          onChange={e => setMovieReleaseDate(Number(e.target.value))}/>
        <input type="checkbox" checked={receiveOscar} 
          onChange={e => {setReceiveOscar(e.targetchecked);console.log(receiveOscar)}}/>
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map(
          movie => {
            return(
              <div>
                <h2 style={{color: movie.receiveOscar ? "green" : "red"}}>{movie.title}</h2>
                <p>Date: {movie.releaseDate}</p>
                <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
                <input type="text" onChange={e => {
                  setUpdatedTitle(e.target.value);
                }}/>
                <button onClick={() => editMovie(movie.id)}>Change Title</button>
              </div>
            );
          }
        )}
      </div>
      <div>
        <input type="file" onChange={e => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload Image</button>
      </div>
    </div>
  );
}

export default App;
