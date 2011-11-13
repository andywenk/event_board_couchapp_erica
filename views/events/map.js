function(doc) {
  if (doc.type === "event") {
      emit(doc.date, {
          id: doc._id,
          rev: doc._rev,
          location: doc.location,
          city: doc.city,
          info: doc.info,
          price: doc.price,
          tags: doc.tags,
          type: doc.type
      });
  }
};