import React from 'react'
import styles from './Card.module.css'

var priorities = {
    "0": "No Priority",
    "1": "Low",
    "2": "Medium",
    "3": "High",
    "4": "Urgent"
}

export function Card({ id, title, tags, userId, priority, usernames }) {
  return (
    <div className={styles.card}>
        <div className={styles.header}>
            <div className={styles.id}>{id}</div>
            {userId !== undefined ? <img className={styles.avatar} width="25" src={`https://ui-avatars.com/api/?name=${usernames[userId]}&background=random`}></img> : <></>}
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.footer}>
            {priority !== undefined ? <img src={`/icons/${priorities[priority]}.svg`} className={styles.priority}></img> : <></>}
            <div className={styles.tags}>
                {tags.map((item) => (
                    <div>{item}</div>
                ))}
            </div>
        </div>
    </div>
  )
}