class HabitAPI {
    static getHabits() {
      return JSON.parse(localStorage.getItem('habits')) || [];
    }
  
    static saveHabits(habits) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  
    static getGoals() {
      return JSON.parse(localStorage.getItem('goals')) || [];
    }
  
    static saveGoals(goals) {
      localStorage.setItem('goals', JSON.stringify(goals));
    }
  }
  
  export default HabitAPI;