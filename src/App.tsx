import React, { useEffect, useState } from 'react';
import { db } from "./firebase"
import './App.css';
import { uid } from 'uid'
import { set, ref, onValue, remove } from "firebase/database"

interface IUser {
  id: string;
  user: string;
  card: string;
  online: boolean;
}
interface IIssue {
  id: string,
  title: string,
  statusVote: boolean,
  mark: string,
}

const cards = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100"];
function App() {
  const [users, setUsers] = useState<IUser[]>()
  const [issues, setIssues] = useState<IIssue[]>()
  const [isReveal, setIsReveal] = useState(false)
  const [isAddIssue, setIsAddIssue] = useState(false)
  const [titleIssue, setTitleIssue] = useState('')
  const [curVote, setCurVote] = useState('')

  //Get users and issues
  useEffect(() => {
    onValue(ref(db, "issues/"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listData: IIssue[] = Object.values(data)
        setIssues(listData);
      }
      else {
        setIssues([])
      }
    })
    onValue(ref(db, "userArr/"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listData: IUser[] = Object.values(data)
        setUsers(listData);
      }
      else
        setUsers([]);
    })
  }, []);

  //Get current user
  const getPlayerFromLocal = () => {
    const local = localStorage.getItem("user");
    if (typeof local === "string") return JSON.parse(local);
    else return null;
  }

  //Choose Card 
  const handleChageCard = (card: any) => {
    set(ref(db, `userArr/${getPlayerFromLocal()?.id}`), {
      ...getPlayerFromLocal(),
      card: card,
    });
  }

  //Reveal Card 
  const handleReveal = () => {
    setIsReveal(true)
    let ave = 0;
    if (users) {
      ave = (users.reduce((acc, cur) => (acc + Number(cur.card)), 0)) / users.length
    }
    const curIssue = issues?.filter(i => i.id === curVote)
    if (curIssue) {
      if (curIssue[0].statusVote === true) {
        set(ref(db, `issues/${curVote}`), {
          ...curIssue[0],
          statusVote: false,
          mark: ave,
        });
      }
    }
  }

  //Open Issue form and Add Isssue
  const handleIsAddIssue = () => {
    setIsAddIssue(true)
  }
  const handleInputIssue = (value: string) => {
    setTitleIssue(value)
  }
  const handleSubmitAddIssue = () => {
    const usid = uid();
    set(ref(db, `issues/${usid}`), {
      id: usid,
      title: titleIssue,
      statusVote: false,
      mark: '',
    });
    setTitleIssue('')
    setIsAddIssue(false)
  }
  const handleCancelIssue = () => {
    setIsAddIssue(false)
  }
  //Delete issue
  const handleDeleteIssue = (id: string) => {
    const starCountRef = ref(db, "issues/" + id)
    remove(starCountRef)
  }
  //Choose issue to vote
  const handleChooseIssue = (id: string) => {
    const curIssue = issues?.filter(i => i.id === id)
    if (curIssue) {
      set(ref(db, `issues/${id}`), {
        ...curIssue[0],
        statusVote: true,
      });
    }
    const otherIssue = issues?.filter(i => i.id !== id)
    if(otherIssue) {
      otherIssue.map(o=>(
        set(ref(db, `issues/${o.id}`), {
          ...o,
          statusVote: false,
        })
      ))
    }
    setCurVote(id);
  }

  return (
    <div className="row m-5">
      <div className="col-8">
        <p className="h3">
          Hello {getPlayerFromLocal()?.user}
        </p>
        <div className="my-5 ">
          <div className="d-flex">
            {users?.map((u, index) => (
              <div key={index} className="mr-3">
                {isReveal === false ? <div className="btn btn-outline-info" style={{ color: "red" }}> {u.card}</div>
                  :
                  <div className="btn btn-outline-info" style={{ color: "blue" }}> {u.card}</div>
                }
                <p className="text-center">{u.user}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-info" onClick={handleReveal}>Submit</button>
        </div>
        <p>Choose a card</p>
        <div>
          {cards.map((c, index) => (
            <button key={index} className="btn btn-outline-primary btn-lg m-2" onClick={() => handleChageCard(c)}>{c}</button>
          ))}
        </div>
        <div className="text-center m-5">
          <p>Average  </p>
          <p className="h4">{users && isReveal === true && (users.reduce((acc, cur) => (acc + Number(cur.card)), 0)) / users.length}</p>
        </div>
        <p>Cách chơi: Tạo issue =&gt; Chọn Vote thí issue =&gt; Chọn Card =&gt; Ấn submit</p>
      </div>
      <div className="col-4">
        <p className="h5">Issues ({issues?.length})</p>
        {issues?.map((d, index) => (
          <div key={index} className="card my-5">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{d.title}</h5>
                <p onClick={() => handleDeleteIssue(d.id)} className="btn btn-outline-danger">X</p>
              </div>
              <p className="card-text">Id: {d.id}</p>
              <div className=" mt-4 d-flex justify-content-between">
                {d.statusVote === false ?
                  <p onClick={() => handleChooseIssue(d.id)} className="btn btn-outline-secondary">Vote this issue</p>
                  :
                  <p className="btn btn-primary">Voting now ...</p>
                }

                <p className="btn btn-outline-secondary">{d.mark === '' ? '-' : d.mark}</p>
              </div>
            </div>
          </div>
        ))}
        <div>
          {isAddIssue === false ?
            <p className="h5" onClick={handleIsAddIssue}>+ Add Issue</p> :
            <div>
              <textarea placeholder="Enter a title for the issue" className="form-control" value={titleIssue} onChange={e => handleInputIssue(e.target.value)}></textarea>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-primary" onClick={handleCancelIssue}>Cancel</button>
                <button className="btn btn-primary  " onClick={handleSubmitAddIssue}>Save</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
export default App;
