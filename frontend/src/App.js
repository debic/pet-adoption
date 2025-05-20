import React, {useState, useCallback} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Users from './Users/Pages/Users'
import AllAnimals from './Animals/Pages/AllAnimals';
import NewAnimal from './Animals/Pages/NewAnimal';
import MainNavigation from './Shared/Components/MainNavigation'
import Footer from './Shared/Components/NavigationElements/Footer';
import UserAnimals from './Animals/Pages/UserAnimals'
import HeroPage from './Animals/Pages/HeroPage'
import AnimalInfo from './Animals/Pages/AnimalInfo'
import UpdateAnimal from './Animals/Pages/UpdateAnimal';
import Auth from './Users/Pages/Auth'
import { AuthContext } from './Shared/Context/auth-context';
import './Style/fonts/fonts.css'
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(false)

  const login = useCallback((uid) => {
    setIsLoggedIn(true)
    setUserId(uid)
  })

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUserId(null)

  })

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
        <Route path="/animals/:animalId" exact> <UpdateAnimal/></Route>
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
  <AuthContext.Provider value={{isLoggedIn:isLoggedIn, userId: userId, login:login, logout:logout}}>
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


