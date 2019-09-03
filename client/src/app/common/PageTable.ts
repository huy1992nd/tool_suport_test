/**
 * Created by HAI on 6/4/2017.
 */
export  class PageTable{

  constructor(){

    this.itemsPerPage =50;
    this.gap =10;
    this.currentPage =0;
  }
  public sort = {
    sortingOrder : 'id',
    reverse : false
  };

  public gap : Number;
  public filteredItems = [];
  public groupedItems = [];
  public itemsPerPage :Number;
  public pagedItems = [];
  public currentPage : Number;
  public items =[];

// calculate page in place
public groupToPages = function () {
  this.pagedItems = [];

  for (var i = 0; i < this.items.length; i++) {
    if (i % this.itemsPerPage === 0) {
      this.pagedItems[Math.floor(i / this.itemsPerPage)] = [ this.items[i] ];
    } else {
      this.pagedItems[Math.floor(i / this.itemsPerPage)].push(this.items[i]);
    }
  }
};

  public range = function (size,start, end) {
  var ret = [];
 // console.log(size,start, end);

  if (size < end) {
    end = size;
    start = size-this.gap;
  }
    if(start<0)
      start =0;
  for (var i = start; i < end; i++) {
    ret.push(i);
  }
  //console.log(ret);
  return ret;
};
  public prevPage = function () {
  if (this.currentPage > 0) {
    this.currentPage--;
  }
};

  public nextPage = function () {
  if (this.currentPage < this.pagedItems.length - 1) {
    this.currentPage++;
  }
};

  public setPage = function (n :String) {
  this.currentPage = n;
};

}
