export default (name,nickname) => {
  if (nickname) {
    return name ? `${name}-${nickname}` : nickname
  } else {
    return name
  }
}
