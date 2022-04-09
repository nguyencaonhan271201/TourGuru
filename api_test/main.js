const getRequest = () => {
  let hotelName = "Days Hotel by Wyndham Singapore at Zhongshan Park (SG Clean)"
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../api/business/businessDashboard/bookingHotels.php?business_id=6vN44qDTjnS3WgoioqIAPbNuioy2&offset=2`,
      true
  )
  xhr.onload = () => {
      if (xhr.status === 200 && xhr.readyState === 4) {
        console.log(xhr.responseText);
      } else {
        alert("Error");
      }
  }
  xhr.send();
};

const postRequest = () => {
  //Params
  let biz_user_id = "E6hwPQwxt4fsBi0gOj5xMfsd6x42";

  let xhr = new XMLHttpRequest();
  xhr.open(
      "POST",
      "../api/business/businessInfo.php",
      true
  )
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
      if (xhr.status === 200 && xhr.readyState === 4) {
        console.log(JSON.parse(xhr.responseText));
      } else {
        alert("Error");
      }
  }
  xhr.send(`biz_user_id=${biz_user_id}`);
};