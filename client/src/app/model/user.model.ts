export class User {
    public account : string;
    public username : string;
    public password: string;
    public list_email: Array<any>;
    public list_group:  Array<any>;
    public list_task:  Array<any>;
    public permission: any;
    public created_date: Date;
    public edited_date: Date;

    constructor(
    ) {
      this.account ="",
      this.username ="",
      this.password ="",
      this.list_email =[],
      this.list_group =[],
      this.list_task =[],
      this.permission=2,
      this.created_date =new Date(),
      this.edited_date = new Date()
    }
  
  }