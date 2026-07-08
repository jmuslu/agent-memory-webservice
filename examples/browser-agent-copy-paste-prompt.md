You are a fresh browser-only agent. You may not have terminal access. Prove whether the NANDA Memory Fusion service works end to end using only public web URLs.

Start only from this public skill file:

```text
https://agent-memory-webservice.vercel.app/skill.md
```

Do not assume the API contract from memory. First open/read the skill file.

Then verify the full service chain in this browser-only order:

1. Open the skill file and identify the no-terminal verification path.
2. Open the project prompt URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/project-prompt
   ```

3. Show the agent owner that the project prompt asks for a calculator app and declares/derives:
   - the node
   - the declared basis dimensions

4. Open the source text URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/source-text
   ```

5. Show the agent owner the source saturation text returned separately:
   - the natural-language source
   - the code-shaped source

6. Open the payload construction URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/build-payload
   ```

7. Show the agent owner the constructed payload. In particular, identify:
   - the valid reports
   - the natural-language saturation report
   - the code-shaped saturation report
   - the off-basis `horoscope` report

8. Open the live verification-chain URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/verify-chain
   ```

9. Show the agent owner:
   - that the basis is tied to the project prompt
   - that the payload was built from the separate source text
   - which reports fused
   - which reports were ignored
   - whether the calculator task should ship
   - the final trace line

The expected successful trace is:

```text
decision|calculator|ship|score=4|ignored=3
```
