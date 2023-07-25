import { db, auth } from "./firebaseConnection";
import { useState, useEffect } from "react";
import { doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
 } from 'firebase/auth'

import './app.css'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
          let listaPost = []
  
          snapshot.forEach((doc) => { 
            listaPost.push({
              id: doc.id,
              titulo: doc.data().titulo,
              autor: doc.data().autor
            })
          })
  
          setPosts(listaPost)
  
        })

      }
    

    loadPosts()

  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log(user)
          setUser(true)
          setUserDetail({
            uid: user.uid, 
            email: user.email
          })
        }else {
          setUser(false)
          setUserDetail({})
        }
      })
    }

    checkLogin()
  }, [])


  async function handleAdd(){
    /*
    await setDoc(doc(db, "posts", "12345"), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('dados registrados no banco')
    })
    .catch((e) => {
      console.log('gerou erro: ' + e)
    })
*/
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log('cadastrado com sucesso')
      setAutor('')
      setTitulo('')
    })
    .catch((e) => {
      console.log( 'erro: ' + e)
    })

  } 

  async function buscarPost(){
    /*
    const postRef = doc(db, "posts", "12345")

    await getDoc(postRef)
      .then((snapshot) => {
        setAutor(snapshot.data().autor)
        setTitulo(snapshot.data().titulo)
      })
      .catch((e) => {
        console.log('erro ao buscar')
      })

      */

      const postsRef = collection(db, "posts")

      await getDocs(postsRef)
      .then((snapshot) => {

        let lista = []

        snapshot.forEach((doc) => { 
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(lista)

      })

      .catch((e) => {
        console.log('deu erro ' + e)
      })

  }

  async function editarPost() { 
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })

    .then(() => {
      console.log('atualizado com sucesso')
      setIdPost('')
      setAutor('')
      setTitulo('')
    })
    .catch((e) => {
      console.log('deu erro' + e) 
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)

    await deleteDoc(docRef)
    .then(() => {
      alert('post deletado com sucesso')
    })

  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("cadastrado com sucesso")
      console.log(value)
      setEmail('')
      setSenha('')
    })
    .catch((e) => {
      if(e.code === 'auth/weak-password'){
        console.log('senha fraca');
      }else if(e.code === 'auth/email-already-in-use'){
        console.log('Email ja existe ');
      }
    })

  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log('user logado com sucesso')
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch((e) => {
      console.log('erro: ' + e)
    })
  }

  async function deslogarUsuario(){
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div> 

      <div className="container" >

        <div>
          {user && ( 
          <>
            <strong>Você está logado! </strong>
            <span>ID: {userDetail.id} - Email: {userDetail.email}</span>
            <br/> <button onClick={deslogarUsuario} >Fazer Logout</button>
            <br/>
            
          </>
            
          )}
        </div>
        
        <h2>Usuários</h2>
        <label>Email</label>
        <input value={email}  onChange={(e) => setEmail(e.target.value)} placeholder="digite seu email" />  

        <label>Senha</label>
        <input value={senha}  onChange={(e) => setSenha(e.target.value)} placeholder="informe sua senha" />

        <button onClick={novoUsuario} >Cadastar</button>
        <button onClick={logarUsuario} >Fazer Login</button>
        

      <br/> <br/>
      </div>

      <hr/>

      <div className="container" >  
        <h2>Posts</h2>

        <label>Id do post: </label>
        <input placeholder="digite o ID do post" value={idPost} onChange={(e) => setIdPost(e.target.value)} /> <br/>

        <label>Titulo: </label>
        <textarea placeholder="digite o titulo" value={titulo} onChange={(e) => setTitulo(e.target.value) } />

        <label>Autor: </label>
        <input type="text" placeholder="autor do post" value={autor} onChange={(e) => setAutor(e.target.value)} />

        <button onClick={handleAdd} >Cadastar</button>
        <button onClick={buscarPost} >Buscar post</button> <br/>
        <button onClick={editarPost} >Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id} >
                <strong>ID: {post.id}</strong> <br/>
                <span>Titulo: {post.titulo} </span> <br/>
                <span>Autor: {post.autor} </span> <br/>
                <button onClick={() => excluirPost(post.id)} >Excluir Post</button> <br/> <br/>
                
              </li>
            )
          })}
        </ul>

      </div>

    </div>
  );
}

export default App;
