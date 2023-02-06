class QuadTreeCell
{
    // centerPos: vec2
    constructor(centerPos, halfWidth, halfHeight)
    {
        this.center = centerPos;
        this.halfWidth = halfWidth;
        this.halfHeight = halfHeight;
    }

    contains(aPoint)
    {
        return (
                (this.center[0] - this.halfWidth)   <= aPoint[0] &&
                (this.center[0] + this.halfWidth)   >= aPoint[0] &&
                (this.center[1] - this.halfHeight)  <= aPoint[1] &&
                (this.center[1] + this.halfHeight)  >= aPoint[1]
               );
    }

    intersects(interval)
    {
        return !(
                 interval.center[0] + interval.halfWidth < this.center[0] - this.halfWidth ||
                 interval.center[0] - interval.halfWidth > this.center[0] + this.halfWidth || 
                 interval.center[1] + interval.halfHeight < this.center[1] - this.halfHeight ||
                 interval.center[1] - interval.halfHeight > this.center[1] + this.halfHeight
                );
    }
}