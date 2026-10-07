import React, {useState, useCallback} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Users from './Users/Pages/Users'
import AllAnimals from './Animals/Pages/AllAnimals';
import NewAnimal from './Animals/Pages/NewAnimal';
import MainNavigation from './Shared/Components/MainNavigation'
import Footer from './Shared/Components/NavigationElements/Footer';
import UserAnimals from './Animals/Pages/UserAnimals'
import HeroPage from './Animals/Pages/HomePage'
import AnimalInfo from './Animals/Pages/AnimalInfo'
import UpdateAnimal from './Animals/Pages/UpdateAnimal';
import Auth from './Users/Pages/Auth'
import AdminDashboard from './Users/Pages/AdminDashboard'
import { AuthContext } from './Shared/Context/auth-context';
import './Style/fonts/fonts.css'
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(false)
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const login = useCallback((uid, userToken, admin = false) => {
    setIsLoggedIn(true)
    setUserId(uid)
    setToken(userToken)
    setIsAdmin(!!admin)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUserId(null)
    setToken(null)
    setIsAdmin(false)
  }, [])

  let routes

  if (isLoggedIn){
    routes = (
      <Switch>
        <Route path="/" exact> <HeroPage/></Route>
        <Route path="/allAnimals" exact>  <AllAnimals/></Route>
        <Route path="/users" exact>  <Users/></Route>
        <Route path="/animals/:animalId" exact> <AnimalInfo/></Route>
        <Route path="/:userId/animals" exact> <UserAnimals/></Route>
        <Route path="/animal/new" exact> <NewAnimal/></Route>
        <Route path="/animals/:animalId/edit" exact> <UpdateAnimal/></Route>
        {isAdmin && <Route path="/admin" exact> <AdminDashboard/></Route>}
        <Redirect to="/"/>
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/" exact> <HeroPage/></Route>
        <Route path="/allAnimals" exact>  <AllAnimals/></Route>
        <Route path="/users" exact>  <Users/></Route>
        <Route path="/:type/auth" exact> <Auth/></Route>
        <Route path="/animals/:animalId" exact> <AnimalInfo/></Route>
        <Route path="/:userId/animals" exact> <UserAnimals/></Route>
        <Redirect to="/auth"/>
      </Switch>
    )
  }

  return (
  <AuthContext.Provider value={{isLoggedIn:isLoggedIn, userId: userId, token: token, isAdmin: isAdmin, login:login, logout:logout}}>
    <Router>
      <MainNavigation/>
      <main>
       {routes}
      </main>
      <Footer/>
    </Router>
  </AuthContext.Provider>
  )
}

export default App;


