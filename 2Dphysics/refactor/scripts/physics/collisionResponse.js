/**
 * A, B are rigidBody objects
 * Uses glMatrix as its vector/ matrix library
 */
 function resolveCollision(A, B, mtv)
 {
    // relative velocity
    let relativeVelocity = vec3.create();
    vec3.subtract(relativeVelocity, A.vel, B.vel);

    // contactNormal
    let contactNormal = vec3.create();
    vec3.subtract(contactNormal, A.pos, B.pos);
    vec3.normalize(contactNormal, contactNormal);
    
    let seperatingVelocityMagnitude = vec3.dot( relativeVelocity, contactNormal );

    // Do not resolve if velocities are separating
    if(seperatingVelocityMagnitude > 0)
        return;

    // Take least elastic restitutionCoeff coefficient
    let e = Math.min( A.restitutionCoeff, B.restitutionCoeff);
    // Calculate part of the impulse in the direction of the contact normal
    // -(1 + e) * relativeVelocity / (A.inv_mass - B.inv_mass)
    vec3.scale(relativeVelocity, relativeVelocity, -(1 + e) / (A.inv_mass + B.inv_mass));

    let impulse = vec3.create();
    let frictionImpulse = vec3.create();

    // Penetration normal
    let theMTV = vec3.fromValues(-mtv[0], -mtv[1], 0);
    vec3.normalize(theMTV, theMTV);
    // Penetration Tangential
    let tangentialDir = vec3.fromValues(theMTV[1], -theMTV[0], 0.0); // for friction:

    // Impulse components in normal and tangential directions
    let impulseMagnitudeInContactNormal = vec3.dot(relativeVelocity, theMTV);
    let impulseMagnitudeInContactTangential = vec3.dot(relativeVelocity, tangentialDir); // for friction:

    vec3.scale(impulse, theMTV, impulseMagnitudeInContactNormal);
    
    // Apply impulse to bodies' velocities:
    let tmp = vec3.create();
    vec3.scale(tmp, impulse, 1.0 / A.mass);
    vec3.add(A.vel, A.vel, tmp); 
    tmp = vec3.create();
    vec3.scale(tmp, impulse, 1.0 / B.mass);
    vec3.subtract(B.vel, B.vel, tmp);

    // Friction resolution
    let mu = 0.43;
    
    vec3.scale(frictionImpulse, tangentialDir, -mu * impulseMagnitudeInContactTangential);
    
    tmp = vec3.create();
    vec3.scale(tmp, frictionImpulse, 1.0 / A.mass);
    vec3.subtract(A.vel, A.vel, tmp); 
    tmp = vec3.create();
    vec3.scale(tmp, frictionImpulse, 1.0 / B.mass);
    vec3.add(B.vel, B.vel, tmp);

    // Apply friction impulse to bodies' velocities:
    // vec3.scale(frictionImpulse, frictionImpulse, -mu);
    // tmp = vec3.create();
    // vec3.scale(tmp, frictionImpulse, 1.0 / A.mass);
    // vec3.add(A.vel, A.vel, tmp); 
    // tmp = vec3.create();
    // vec3.scale(tmp, frictionImpulse, 1.0 / B.mass);
    // vec3.subtract(B.vel, B.vel, tmp);
}