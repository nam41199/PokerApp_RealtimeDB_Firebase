import React from 'react';
import { uid } from 'uid';
import { useState } from 'react';
import { db } from "./firebase"
import './App.css';
import { set, ref } from "firebase/database"
import { useHistory } from 'react-router-dom';

function Login() {

    const [user, setUser] = useState('')
    const history = useHistory();

    const addUser = () => {
        const usid = uid();
        set(ref(db, `userArr/${usid}`), {
            user,
            card: '-',
            id: usid,
            online: false,
        });
        setUser('')
        localStorage.setItem("user", JSON.stringify({
            user,
            card: '-',
            id: usid,
            online: false,
        }));
        history.push("/home")
    }

    const handleAddUser = (e: any) => {
        setUser(e.target.value);

    }

    return (
        <div className="border rounded w-50 mx-auto my-5">
            <p className="h1 text-center mt-3">Planning Poker</p>
            <div className="input-group mb-3 w-75 mx-auto my-5">
                <input value={user} onChange={handleAddUser} type="text" className="form-control" placeholder="Account Name" aria-label="Recipient's username" aria-describedby="button-addon2" />
                <div className="input-group-append">
                    <button onClick={addUser} className="btn btn-outline-secondary" type="button" id="button-addon2">Enter your name</button>
                </div>
            </div>
        </div>

    )
}
export default Login;