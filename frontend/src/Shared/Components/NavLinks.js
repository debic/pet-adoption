import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/auth-context";
import "../Shared.css";
import Button from "./Button";

export default function NavLinks(props) {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink className="secondaryBTN" to="/" exact>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink className="secondaryBTN" to="/allAnimals" exact>
          All animals
        </NavLink>
      </li>

      {auth.isLoggedIn && (
        <li>
          <NavLink className="secondaryBTN" to={`/${auth.userId}/animals`}>My animals</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink className="secondaryBTN" to="/animal/new">Add animals</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <>
          <li>
            <NavLink className="button-auth-login" to="/login/auth">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink className="button-auth-signUp" to="/signup/auth">
              Sign up
            </NavLink>
          </li>
        </>
      )}
      {auth.isLoggedIn && (
        <li>
          <Button basic className="button-auth-login"   onClick={auth.logout}>
            Logout
          </Button>
        </li>
      )}
    </ul>
  );
}
