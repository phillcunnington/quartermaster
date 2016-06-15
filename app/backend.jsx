import axios from "axios";

const Backend = {
  initialise: () => {
    return axios.get("./data/data.json")
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log("Error getting data.json! " + err);
      });
  }
}

module.exports = Backend;
