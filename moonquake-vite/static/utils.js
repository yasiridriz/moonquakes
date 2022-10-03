export const drawFuncs = (THREE, moon, moonRadius, spheres) => {
    const drawSphere = (lat, long, color, size, data) => {
    
   
     const pi = Math.PI
     const sphereMaterial = new THREE.MeshStandardMaterial({ color: color, opacity: 0.5 });
     const SphereGeometry = new THREE.SphereGeometry(size, 30, 30);
     const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial);
   
     moon.add(sphere);
   
     const d = moonRadius + 0.4;
   
      sphere.position.x = d * Math.sin((lat * pi) / 180) * Math.cos((long * pi) / 180);
   
     sphere.position.y = d * Math.sin((lat * pi) / 180) * Math.sin((long * pi) / 180);
   
     sphere.position.z = d * Math.cos((lat * pi) / 180);
   
   
     if (color === "#F63E02") {
       spheres.push({sphere: sphere, data: data, type: "Shallow Moonquake"})
     }
   
     if (color === "#41969F") {
       const newData = {...data, year: "19" + data.year}
       spheres.push({sphere: sphere, data: newData, type: "Artificial Impact"})
     }
   
     if (color === "#4E376D") {
       const newData = {...data, year:"No data."};
       spheres.push({sphere: sphere, data: newData, type: "Deep Moonquake"})
     }  
   };
   
    const drawAI = (AI) => {
     const color = "#41969F";
     AI.Lat.forEach((lat, index) => {
       drawSphere(lat, AI.Long[index], color, 0.4, {year: AI.Y[index], lat: lat, long: AI.Long[index]});
     });
   };
   
    const drawDM = (DM) => {
     const color = "#4E376D";
     DM.Lat.forEach((lat, index) => {
       drawSphere(
         lat,
         DM.Long[index],
         color,
         0.00035 * DM.Depth[index],
         {year: null, lat: lat, long: DM.Long[index], depth: DM.Depth[index]}
       );});
   };
   
   const drawSM = (SM) => {
     const color = "#F63E02";
     SM.Lat.forEach((lat, index) => {
       drawSphere(
         lat,
         SM.Long[index],
         color,
         0.15 * SM.Magnitude[index],
         {year: SM.Year[index], lat: lat, long: SM.Long[index]}
       );
     });
   };
   return { drawDM, drawSM, drawAI }
   }