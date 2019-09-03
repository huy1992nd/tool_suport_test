if (obj.task.send_chatwork.length > 0) {
  switch (obj.task.task_name) {
    case "task_show_trade":
      if (obj.total_over > 0 || obj.number_err > 0) {
        obj.task.send_chatwork.map(chatworkGroup => {
          this.sendChatwork(obj.message, chatworkGroup);
        });
      }
      break;

    default:
      obj.task.send_chatwork.map(chatworkGroup => {
        this.sendChatwork(obj.message, chatworkGroup);
      });
      break;
  }
}