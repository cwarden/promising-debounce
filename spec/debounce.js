var resolveDummyPromiseAsync = function() {
	var deferred = $.Deferred();
	var args = arguments;
	setTimeout(function() {
		deferred.resolve.call(deferred, _(args).first());
	}, 0);
	return deferred.promise();
};

describe('debounce', function() {
	var spy, debounced, promise;
	beforeEach(function() {
		jasmine.Clock.useMock();
		spy = jasmine.createSpy().andCallFake(resolveDummyPromiseAsync);
		debounced = debounce(spy, 100);
	});
	it('should not call the function until the wait period has finished', function() {
		debounced();
		expect(spy.calls.length).toBe(0);
	});
	it('should call the function after wait period has finished', function() {
		debounced();
		jasmine.Clock.tick(100);
		expect(spy.calls.length).toBe(1);
	});
	it('should debounce the function', function() {
		_(2).times(debounced);
		jasmine.Clock.tick(100);
		expect(spy.calls.length).toBe(1);
	});
	it('should reset after wait', function() {
		debounced();
		jasmine.Clock.tick(100);
		expect(spy.calls.length).toBe(1);
		debounced();
		expect(spy.calls.length).toBe(1);
		jasmine.Clock.tick(100);
		expect(spy.calls.length).toBe(2);
	});
	it('should return a promise', function() {
		promise = debounced();
		expect(promise.promise).toBeDefined();
	});
	it('should provide result to all callers', function() {
		spy.andCallFake(_(resolveDummyPromiseAsync).partial('result'));
		var result1, result2;
		runs(function() {
			promise = debounced().then(function(result) { result1 = result; });
			debounced().then(function(result) { result2 = result; });
			jasmine.Clock.tick(100);
		});
		waitsFor(function() {
			return promise.state() !== 'pending';
		});
		runs(function() {
			expect(result1).toBe('result');
			expect(result2).toBe('result');
		});
	});
	it('should work with functions that do not return promises', function() {
		spy.andReturn('result');
		var result1;
		runs(function() {
			promise = debounced().then(function(result) { result1 = result; });
			jasmine.Clock.tick(100);
		});
		waitsFor(function() {
			return promise.state() !== 'pending';
		});
		runs(function() {
			expect(result1).toBe('result');
		});
	});
	describe('when immediate argument is true', function() {
		beforeEach(function() {
			debounced = debounce(spy, 100, 'immediate');
		});
		it('should provide result to all callers', function() {
			var result1, result2;
			runs(function() {
				spy.andCallFake(_(resolveDummyPromiseAsync).partial('result1'));
				promise = debounced().then(function(result) { result1 = result; });
				spy.andCallFake(_(resolveDummyPromiseAsync).partial('result2'));
				debounced().then(function(result) { result2 = result; });
				jasmine.Clock.tick(100);
			});
			waitsFor(function() {
				return promise.state() !== 'pending';
			});
			runs(function() {
				expect(result1).toBe('result1');
				expect(result2).toBe('result1');
			});
		});
		it('should call the function immediately the first time invoked', function() {
			debounced();
			expect(spy.calls.length).toBe(1);
		});
		it('should wait until wait period has finished after the first call', function() {
			debounced();
			expect(spy.calls.length).toBe(1);
			debounced();
			jasmine.Clock.tick(100);
			expect(spy.calls.length).toBe(1);
		});
		it('should reset after wait', function() {
			debounced();
			jasmine.Clock.tick(100);
			expect(spy.calls.length).toBe(1);
			debounced();
			expect(spy.calls.length).toBe(2);
			jasmine.Clock.tick(100);
		});
	});
});

