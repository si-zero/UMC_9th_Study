// ✅ 해당 가게가 있는지 조회할 때 사용하는 DTO
export const bodyToStore = (body) => {
  return {
    regions_id: body.regions_id,   // 필수
    name: body.name,               // 필수
    lat: body.lat || null,         // 선택
    lng: body.lng || null,         // 선택
    created_at: new Date(),
    updated_at: new Date()
  };
};

// ✅ 조회 시 반환하는 DTO
export const responseFromStore = (store) => {
  return {
    store_id: store.store_id,
    name: store.name,
    lat: store.lat,
    lng: store.lng,
    created_at: store.created_at,
    updated_at: store.updated_at,
    regions_id: store.regions_id
  };
};

export const requestToStore = (body) => {
  return {
    regionsId: body.regionsId,
    name: body.name,
    lat: body.lat,
    lng: body.lng,
  }
  
}