export class Group {
    public name : string;
    public group_key : string;
    public list_user: Array<any>;
    public list_task:  Array<any>;
    public created_date: Date;
    public edited_date: Date;

    constructor(
    ) {
      this.name ="",
      this.group_key ="",
      this.list_task =[],
      this.list_user =[],
      this.created_date =new Date(),
      this.edited_date = new Date()
    }
  
  }