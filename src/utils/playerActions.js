const setDeviceId = (deviceId) => ({
  type: "SET_DEVICE_ID",
  payload: { deviceId: deviceId },
});

const getDeviceId = () => ({
  type: "GET_DEVICE_ID",
  payload: { deviceId: deviceId },
});

module.exports = {
  setDeviceId,
  getDeviceId,
};
