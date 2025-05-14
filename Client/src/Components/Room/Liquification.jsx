function findIdx(k, members) {
  return members.indexOf(k);
}

export const liquification = ({ members, payments }) => {
  if (!members || !payments || members.length === 0 || payments.length === 0) {
      return [];
  }

  const memberCount = members.length;
  const matrix = Array.from({ length: memberCount }, () => 
      new Array(memberCount).fill(0)
  );

  // Process each valid payment
  payments.forEach(payment => {
      if (!payment.paymentBy || payment.amount <= 0 || !payment.participants || payment.participants.length === 0) {
          return;
      }

      const payerIdx = findIdx(payment.paymentBy, members);
      if (payerIdx === -1) return;
      
      const amountPerParticipant = payment.amount / payment.participants.length;
      
      payment.participants.forEach(participant => {
          const parIdx = findIdx(participant, members);
          if (parIdx !== -1) {
              matrix[parIdx][payerIdx] += amountPerParticipant;
          }
      });
  });

  const liquifiedArray = [];

  // Calculate net amounts between members
  for (let i = 0; i < memberCount; i++) {
      for (let j = i + 1; j < memberCount; j++) {
          const diff = matrix[i][j] - matrix[j][i];
          
          if (Math.abs(diff) > 0.01) { // Threshold for meaningful amounts
              liquifiedArray.push({
                  payer: diff > 0 ? members[i] : members[j],
                  reciever: diff > 0 ? members[j] : members[i],
                  amount: parseFloat(Math.abs(diff).toFixed(2))
              });
          }
      }
  }

  return liquifiedArray;
};
