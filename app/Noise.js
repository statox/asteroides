function Noise(params) {
    const x = params.x || 0;
    const y = params.y || 0;
    const z = params.z || 0;
    // Number of levels of detail
    const octaves = params.octaves || 5;
    // Determine how much each octave contributes to the overall shape (adjusts amplitude)
    // > 1 Sucessive octaves contribute more and result closer to random noise
    // < 1 is a good default
    const persistence = params.persistence || 0.5;
    // Determines how much detail is added or removed at each octave (adjusts frequency)
    // defautl > 1
    const lacunarity = params.lacunarity || 2;

    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let totalAmplitude = 0; // Used for normalizing result to 0.0 - 1.0
    for (let i = 0; i < octaves; i++) {
        total += noise(x * frequency, y * frequency, z * frequency) * amplitude;
        totalAmplitude += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return total / totalAmplitude;
}
