You are a fresh browser-only agent. You may not have terminal access. Prove whether the NANDA Memory Fusion service works end to end using only public web URLs.

Start only from this public skill file:

```text
https://agent-memory-webservice.vercel.app/skill.md
```

Do not assume the API contract from memory. First open/read the skill file.

Important scope note: evaluate this as a stateless public verification demo, not as a production long-term memory store. Do not send private data. The public GET endpoints are intended for browser-only inspection and use fixed demonstration data.

Then verify the full service chain in this browser-only order:

1. Open the skill file and identify the no-terminal verification path.
2. Open the scope URL and identify what the service is and is not:

   ```text
   https://agent-memory-webservice.vercel.app/api/scope
   ```

3. Open the project prompt URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/project-prompt
   ```

4. Show the agent owner that the project prompt asks for a calculator app and declares/derives:
   - the node
   - the declared basis dimensions

5. Open the source text URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/source-text
   ```

6. Show the agent owner the source saturation text returned separately:
   - the natural-language source
   - the code-shaped source

7. Open the payload construction URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/build-payload
   ```

8. Show the agent owner the constructed payload. In particular, identify:
   - the valid reports
   - the natural-language saturation report
   - the code-shaped saturation report
   - the off-basis `horoscope` report

9. Open the live verification-chain URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/verify-chain
   ```

10. Show the agent owner:
   - that the basis is tied to the project prompt
   - that the payload was built from the separate source text
   - which reports fused
   - which reports were ignored
   - whether the calculator task should ship
   - the final trace line

11. Open the GET-only adversarial suite:

   ```text
   https://agent-memory-webservice.vercel.app/api/adversarial-suite
   ```

12. Show the agent owner:
   - whether a huge off-basis delta was ignored
   - whether fractional evidence was rejected
   - how negative signed evidence changes the score
   - whether a spoofed report using a valid basis name was accepted
   - that basis-name spoofing is reported as a known limitation of this basis-only memory layer, not hidden as solved provenance/authentication

The expected successful trace is:

```text
decision|calculator|ship|score=4|ignored=3
```
