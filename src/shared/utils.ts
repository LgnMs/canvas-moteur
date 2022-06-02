import {Shape} from "../type";

/**
 * 两个shape是否相同
 * @param shape1
 * @param shape2
 */
export  function areSameShape(shape1: Shape | null, shape2: Shape | null) {
    if (shape1 && !shape2) return false
    if (!shape1 && shape2) return false
    return !(shape1 && shape2 && shape1.id !== shape2.id);
}
