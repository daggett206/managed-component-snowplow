import {getDomainHash} from "../src/utils";

describe('getDomainHash', () => {
  it('should return a string of length 4', () => {
    const result = getDomainHash('example.com');
    expect(result).toHaveLength(4);
  });

  it('should return a hash that only contains lowercase letters and digits', () => {
    const result = getDomainHash('example.com');
    const validCharacters = /^[a-z0-9]+$/;
    expect(result).toMatch(validCharacters);
  });

  it('should return the same hash for the same input string', () => {
    const input = 'example.com';
    const result1 = getDomainHash(input);
    const result2 = getDomainHash(input);
    expect(result1).toEqual(result2);
  });

  it('should return different hashes for different input strings', () => {
    const input1 = 'example.com';
    const input2 = 'example.org';
    const result1 = getDomainHash(input1);
    const result2 = getDomainHash(input2);
    expect(result1).not.toEqual(result2);
  });
});