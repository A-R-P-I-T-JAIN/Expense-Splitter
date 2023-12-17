function findIdx(k,members){
    let idx =  members.findIndex((w) => {
         return w === k
     })
 
     return idx
 }

export const liquification = ({ members, payments }) => {

    if(members.length === 0 || payments.length === 0)return;

  const rows = members.length;
  const columns = members.length;

  const matrix = Array(rows)
    .fill()
    .map(() => Array(columns).fill(0));

  for (let i = 0; i < payments.length; i++) {
    let index = findIdx(payments[i].paymentBy,members);
    
    let amount = payments[i].amount / payments[i].participants.length;
    
    for (let j = 0; j < payments[i].participants.length; j++) {
      let parIdx = findIdx(payments[i].participants[j],members);
      matrix[parIdx][index] = amount;
    }
  }


  let liquifiedArray = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = i; j < matrix.length; j++) {
      if (i === j) continue;

      if (matrix[i][j] === matrix[j][i]) {
        continue;
      } else if (matrix[i][j] > matrix[j][i]) {
        let calcAmt = matrix[i][j] - matrix[j][i];
        liquifiedArray.push({
          payer: members[i],
          reciever: members[j],
          amount: Math.floor(calcAmt),
        });
      } else {
        let calcAmt = matrix[j][i] - matrix[i][j];
        liquifiedArray.push({
          payer: members[j],
          reciever: members[i],
          amount: Math.floor(calcAmt),
        });
      }
    }
  }

  return liquifiedArray;
};