function findIdx(k, members) {
  return members.indexOf(k);
}

export const liquification = ({ members, payments }) => {
  if (members.length === 0 || payments.length === 0) return [];

  const memberCount = members.length;
  const matrix = Array.from({ length: memberCount }, () => 
      new Array(memberCount).fill(0)
  );

  // Process each payment
  payments.forEach(payment => {
      const payerIdx = findIdx(payment.paymentBy, members);
      if (payerIdx === -1) return; // Skip if payer not found
      
      const amountPerParticipant = payment.amount / payment.participants.length;
      
      payment.participants.forEach(participant => {
          const parIdx = findIdx(participant, members);
          if (parIdx !== -1) { // Only process valid participants
              matrix[parIdx][payerIdx] += amountPerParticipant;
          }
      });
  });

  const liquifiedArray = [];

  // Calculate net amounts between members
  for (let i = 0; i < memberCount; i++) {
      for (let j = i + 1; j < memberCount; j++) {
          const diff = matrix[i][j] - matrix[j][i];
          
          if (Math.abs(diff) > 0.001) { // Using small epsilon to avoid floating point precision issues
              if (diff > 0) {
                  liquifiedArray.push({
                      payer: members[i],
                      reciever: members[j],
                      amount: parseFloat(diff.toFixed(2)) // Keeping 2 decimal places
                  });
              } else {
                  liquifiedArray.push({
                      payer: members[j],
                      reciever: members[i],
                      amount: parseFloat(Math.abs(diff).toFixed(2))
                  });
              }
          }
      }
  }

  return liquifiedArray;
};
