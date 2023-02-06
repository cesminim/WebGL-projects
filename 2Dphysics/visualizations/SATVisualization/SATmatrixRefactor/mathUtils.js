function normalize(arr)
{
	let ret = [];
    let len = length(arr);
    for(let i = 0; i < arr.length; i++)
    {
        ret.push(arr[i] / len)
    }
	return ret;
}

function length(arr)
{
	let tmp = 0;
    for(let i = 0; i < arr.length; i++)
    {
        tmp += arr[i] * arr[i];
    }
	return Math.sqrt(tmp);
}

function toDegrees(rad)
{
	return rad * (180.0 / Math.PI);
}
function toRadians(deg)
{
	return (deg * Math.PI / 180.0);
}
function linearScale(x0, y0, x, m)
{
    return [x, ( m * (x - x0) + y0)];
}

function distSquared(pos1, pos2)
{
    return (Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2) );
}
