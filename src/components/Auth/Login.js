import React, { useState } from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from './validateLogin'
import firebase from '../../firebase/firebase'

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
}


function Login(props) {

  const { handleChange, handleSubmit, handleBlur, errors, isSubmitting, values } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser)
  const [login, setLogin] = useState(true)

  async function authenticateUser() {
    const { name, email, password } = values
    const response = login 
      ? await firebase.login(email, password)
      : await firebase.register(name, email, password)
    console.log({ response })
  }

  return (
    <div>
      <h2 className="mv3">{login ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && (
        <input 
        onBlur={handleBlur}
        onChange={handleChange} 
        value={values.name}
        type="text" 
        placeholder="Your name" 
        autoComplete="off" 
        name="name" />
        )}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          type="email"
          placeholder="Your email"
          autoComplete="off"
          name="email"
          className={errors.email && 'error-input'}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          type="password"
          placeholder="Choose a secure password"
          name="password"
          className={errors.password && 'error-input'}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <div className="flex mt3">
          <button type="submit" className="button pointer mr2" disabled={isSubmitting} style={{ background: isSubmitting ? "grey" : "orange"}}>
            Submit
          </button>
          <button type="button" className="pointer button" onClick={() => setLogin(prevLogin => !prevLogin)}>
            {login ? "need to create an account?" : "already have an account?"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;
