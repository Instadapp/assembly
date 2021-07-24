//@ts-nocheck
export default class Protocol {
  constructor(data) {
    if (data) {
      this.name = data.name;
      this.tokenKey = data.tokenKey;
    } else {
      this.name = "";
      this.tokenKey = "";
    }
  }
}
