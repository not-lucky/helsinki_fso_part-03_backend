const Notification = ({ notification }) => {
  if (notification.type === "blank") {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification
