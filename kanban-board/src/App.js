import { useEffect, useState } from 'react';
import styles from './App.module.css';
import { Card } from './components/Card';

const Statuses = ["Backlog", "Todo", "In progress", "Done", "Cancelled"]
const Priorities = ["No Priority", "Urgent", "High", "Medium", "Low"]

var priorities = {
  "No Priority": "0",
  "Low": "1",
  "Medium": "2",
  "High": "3",
  "Urgent": "4"
}


function App() {
  var [closed, setClosed] = useState(true)
  var [tickets, setTickets] = useState({})
  var [users, setUsers] = useState({})
  var [cards, setCards] = useState({})
  var [orderedCards, setOrderedCards] = useState({})
  var [grouping, setGrouping] = useState("")
  var [ordering, setOrdering] = useState("")

  useEffect(() => {
    document.getElementById("optBox").classList.remove(closed ? styles.openBox : styles.closeBox)
    document.getElementById("optBox").classList.add(closed ? styles.closeBox : styles.openBox)
  }, [closed])

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment").then((resp) => {
      return resp.json()
    }).then((data) => {
      setTickets(data.tickets)

      var users_obj = {}
      
      for (var user of data.users) {
        users_obj[user.id] = user.name
      }

      setUsers(users_obj)
    })
  }, [])

  useEffect(() => {
    setGrouping(document.getElementById("grp-opt").value)
    setOrdering(document.getElementById("ord-opt").value)
  }, [])

  useEffect(() => {
    if (grouping == "Status") {
      var newCards = {
        "Backlog": [],
        "Todo": [],
        "In progress": [],
        "Done": [],
        "Cancelled": []
      }
      for (var i in tickets) {
        newCards[tickets[i].status].push(tickets[i])
      }
      setCards(newCards)
    } else if (grouping == "Priority") {
      var newCards = {
        "0": [],
        "1": [],
        "2": [],
        "3": [],
        "4": []
      }
      for (var i in tickets) {
        newCards[tickets[i].priority.toString()].push(tickets[i])
      }
      setCards(newCards)
    } else {
      var newCards = {}
      for (var i in tickets) {
        if (newCards[tickets[i].userId] === undefined) {
          newCards[tickets[i].userId] = []
        }
        newCards[tickets[i].userId].push(tickets[i])
      }
      setCards(newCards)
    }
  }, [grouping, tickets])

  useEffect(() => {
    var tempCards = {...cards}

    if (ordering == "Priority") {
      for (var key in tempCards) {
        tempCards[key] = tempCards[key].sort((x, y) => {
          if (x.priority > y.priority) {
            return -1
          } if (x.priority < y.priority) {
            return 1
          }
          return 0
        })
      }
      setOrderedCards(tempCards)
    } else {
      for (var key in tempCards) {
        tempCards[key] = tempCards[key].sort((x, y) => {
          if (x.title < y.title) {
            return -1
          } if (x.title > y.title) {
            return 1
          }
          return 0
        })
      }
      setOrderedCards(tempCards)
    }
  }, [ordering, cards])

  const setGroup = () => {
    setGrouping(document.getElementById("grp-opt").value)
    setClosed(!closed)
  }

  const setOrder = () => {
    setOrdering(document.getElementById("ord-opt").value)
    setClosed(!closed)
  }

  return (
    <>
      <div className={styles.head}>
        <div className={styles.optionBtn}><div className={styles.optionBtnCont} onClick={() => {
          setClosed(!closed)
        }}><img src='/icons/Display.svg'></img>Display<img src='/icons/down.svg'></img></div>
          <div className={styles.closeBox} id='optBox'>
            <div className={styles.opt}>
              <div>Grouping</div>
              <select className={styles.option} id='grp-opt' onChange={() => {
                setGroup()
              }}>
                <option value="Status">Status</option>
                <option value="User">User</option>
                <option value="Priority">Priority</option>
              </select>
            </div>
            <div className={styles.opt}>
              <div>Ordering</div>
              <select className={styles.option} id='ord-opt' onChange={() => {
                setOrder()
              }}>
                <option value="Priority">Priority</option>
                <option value="Title">Title</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.columns}>
        {
          grouping == "Status" ?
          Statuses.map((item) => (
            <div className={styles.content}>
              <div className={styles.columnHead}><img src={`/icons/${item}.svg`} width='20'></img>{item}<div>{orderedCards[item] !== undefined ? orderedCards[item].length : 0}</div><div className={styles.subopts}><img src='/icons/add.svg'></img><img src='/icons/3 dot menu.svg'></img></div></div>
              {
                
                orderedCards[item] !== undefined ? orderedCards[item].map((item) => (
                  <Card id={item.id} title={item.title} tags={item.tag} userId={item.userId} priority={item.priority.toString()} usernames={users}></Card>

                )):<></>
              }
            </div>
          )):
          grouping == "Priority" ?
          Priorities.map((item) => (
            <div className={styles.content}>
              <div className={styles.columnHead}><img src={`/icons/${item}.svg`} width='20'></img>{item}<div>{orderedCards[priorities[item]] !== undefined ? orderedCards[priorities[item]].length : 0}</div><div className={styles.subopts}><img src='/icons/add.svg'></img><img src='/icons/3 dot menu.svg'></img></div></div>
              {

                orderedCards[priorities[item]] !== undefined ? orderedCards[priorities[item]].map((item) => (
                  <Card id={item.id} title={item.title} tags={item.tag} userId={item.userId} priority={undefined} usernames={users}></Card>

                )):<></>
              }
            </div>
          )):
          Object.keys(cards).map((item_key) => (
            <div className={styles.content}>
              <div className={styles.columnHead}><img src={`https://ui-avatars.com/api/?name=${users[item_key]}&background=random`} width='25'></img>{users[item_key]}<div>{orderedCards[item_key] !== undefined ? orderedCards[item_key].length : 0}</div><div className={styles.subopts}><img src='/icons/add.svg'></img><img src='/icons/3 dot menu.svg'></img></div></div>
              {

                orderedCards[item_key] !== undefined ? orderedCards[item_key].map((item) => (
                  <Card id={item.id} title={item.title} tags={item.tag} userId={undefined} priority={item.priority.toString()} usernames={users}></Card>

                )):<></>
              }
            </div>
          ))
        }
      </div>
    </>
  );
}

export default App;