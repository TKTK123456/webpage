function getChannels() {
  $.get("/channelList.txt", (data, status) => {
    console.log(data);
    $(`#test`).text(data);
    alert(data)
  });
}