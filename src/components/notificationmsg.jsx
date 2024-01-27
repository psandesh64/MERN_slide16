const NotificationMsg =({noti})=>{
    return (
        <>
        <p className={noti.css}>{noti.status}</p>
        </>
    )
}

export default NotificationMsg