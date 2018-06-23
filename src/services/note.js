/**
 * Created by WebStorm
 * User : zhumengyue
 * Date : 2018/6/23
 * Time : 21:36
 * Desc :
 */
import request from '../utils/request';

export function getNote() {
  return request('./note.json');
}
