export class Task {
    public task_name : string;
    public task_name_detail : string;
    public list_mail_other : Array<any>;
    public active: boolean;
    public template: any;
    public list_group:  Array<any>;
    public send_chatwork:  Array<any>;
    public created_date: Date;
    public edited_date: Date;

    constructor(
    ) {
      this.task_name ="",
      this.task_name_detail ="",
      this.list_mail_other = [],
      this.active = false,
      this.send_chatwork =[],
      this.list_group =[],
      this.created_date =new Date(),
      this.edited_date = new Date()
    }
  
  }