import {Weather} from "../weather/index.js";
import {getScheduleByPlusDays} from "../schedule/index.js";


console.log(await Weather.getString())
console.log(await getScheduleByPlusDays(1))
